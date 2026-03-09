export default function StandpointButtons() {
  return (
    <div className="flex flex-col h-full gap-4 p-6">
      <button className="flex-1 flex flex-col items-center justify-center gap-2 bg-summa-green text-summa-white summa-button text-xl md:text-2xl shadow-lg">
        <span className="text-4xl">✅🙂</span>
        <span>Acceptabel</span>
      </button>
      
      <button className="flex-1 flex flex-col items-center justify-center gap-2 bg-summa-blue text-summa-white summa-button text-xl md:text-2xl shadow-lg">
        <span className="text-4xl">🤔❓</span>
        <span>?</span>
      </button>
      
      <button className="flex-1 flex flex-col items-center justify-center gap-2 bg-summa-red text-summa-white summa-button text-xl md:text-2xl shadow-lg">
        <span className="text-4xl">⛔😬</span>
        <span>Onacceptabel</span>
      </button>
    </div>
  );
}
