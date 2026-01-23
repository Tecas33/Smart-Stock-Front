import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"
        style={{ animationDuration: '1s' }}
      ></div>
      
      <div className="text-center">
        <p className="text-indigo-950 font-bold text-lg animate-pulse" style={{ animationDuration: '2s' }}>
          Processando...
        </p>
        <p className="text-gray-400 text-xs">Aguarde a resposta do servidor</p>
      </div>
    </div>
  );
};

export default Loader;