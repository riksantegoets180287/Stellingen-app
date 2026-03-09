import React from 'react';
import { TileContent, AccentColor } from '../types';
import { X, Upload, Palette } from 'lucide-react';

interface TileEditorProps {
  tile?: TileContent;
  onSave: (tile: TileContent) => void;
  onCancel: () => void;
}

const ACCENT_COLORS: { label: string; value: AccentColor; hex: string }[] = [
  { label: 'Indigo', value: 'indigo', hex: '#20126E' },
  { label: 'Blauw', value: 'blue', hex: '#0064B4' },
  { label: 'Geel', value: 'yellow', hex: '#FFC800' },
  { label: 'Groen', value: 'green', hex: '#19E196' },
  { label: 'Rood', value: 'red', hex: '#DC1E50' },
];

export default function TileEditor({ tile, onSave, onCancel }: TileEditorProps) {
  const [formData, setFormData] = React.useState<Partial<TileContent>>(
    tile || {
      title: '',
      statement: '',
      schoolStandpoint: '',
      accentColor: 'indigo',
      isVisible: true,
      image: '',
    }
  );

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = 'Vul een titel in.';
    if (!formData.statement?.trim()) newErrors.statement = 'Vul een stelling in.';
    if (!formData.schoolStandpoint?.trim()) newErrors.schoolStandpoint = 'Vul het standpunt van school in.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        id: formData.id || crypto.randomUUID(),
      } as TileContent);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-3xl summa-card my-8">
        <div className="flex items-center justify-between p-6 border-b border-summa-gray">
          <h2 className="text-2xl text-summa-indigo">
            {tile ? 'Tegel Bewerken' : 'Nieuwe Tegel'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-summa-gray rounded-full">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1 uppercase text-summa-dark/60">Titel</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 bg-summa-gray rounded-lg border-2 border-transparent focus:border-summa-indigo outline-none"
                />
                {errors.title && <p className="text-summa-red text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 uppercase text-summa-dark/60">Accentkleur</label>
                <div className="flex gap-2">
                  {ACCENT_COLORS.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, accentColor: color.value })}
                      className={`w-10 h-10 rounded-full border-4 transition-all ${formData.accentColor === color.value ? 'border-summa-dark scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={e => setFormData({ ...formData, isVisible: e.target.checked })}
                    className="w-5 h-5 accent-summa-indigo"
                  />
                  <span className="font-bold text-summa-dark/60 uppercase text-sm">Zichtbaar</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold mb-1 uppercase text-summa-dark/60">Afbeelding</label>
              <div className="relative group aspect-video bg-summa-gray rounded-xl overflow-hidden border-2 border-dashed border-summa-dark/20 flex flex-col items-center justify-center">
                {formData.image ? (
                  <>
                    <img src={formData.image} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="bg-summa-red text-summa-white px-4 py-2 rounded-lg text-sm font-bold"
                      >
                        Verwijderen
                      </button>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-2 text-summa-dark/40 hover:text-summa-indigo transition-colors">
                    <Upload size={32} />
                    <span className="text-sm font-bold">Upload afbeelding</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
              <div className="mt-2 text-xs text-summa-dark/40">
                Of plak een URL:
                <input
                  type="text"
                  value={formData.image?.startsWith('data:') ? '' : formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full mt-1 p-2 bg-summa-gray rounded border border-summa-dark/10 text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 uppercase text-summa-dark/60">Stellingtekst</label>
            <textarea
              rows={3}
              value={formData.statement}
              onChange={e => setFormData({ ...formData, statement: e.target.value })}
              className="w-full p-3 bg-summa-gray rounded-lg border-2 border-transparent focus:border-summa-indigo outline-none resize-none"
            />
            {errors.statement && <p className="text-summa-red text-xs mt-1">{errors.statement}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 uppercase text-summa-dark/60">Standpunt School</label>
            <textarea
              rows={4}
              value={formData.schoolStandpoint}
              onChange={e => setFormData({ ...formData, schoolStandpoint: e.target.value })}
              className="w-full p-3 bg-summa-gray rounded-lg border-2 border-transparent focus:border-summa-indigo outline-none resize-none"
            />
            {errors.schoolStandpoint && <p className="text-summa-red text-xs mt-1">{errors.schoolStandpoint}</p>}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 summa-button bg-summa-indigo text-summa-white"
            >
              Opslaan
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 summa-button bg-summa-gray text-summa-dark"
            >
              Annuleren
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
