
import React from 'react';

// This component has been simplified to remove the comparison table
const UserTypeComparison = () => {
  return (
    <div className="w-full overflow-auto bg-white rounded-md shadow p-4">
      <div className="mb-6 p-4 bg-blue-100 border-l-4 border-blue-500 rounded-md">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">
          Sistema imobiliário
        </h3>
        <p className="text-sm text-blue-700">
          Bem-vindo ao sistema. Este é seu painel principal onde você pode gerenciar suas atividades.
        </p>
      </div>
    </div>
  );
};

export default UserTypeComparison;
