
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";

const UserTypeComparison = () => {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableCaption>Comparação entre os diferentes tipos de usuários</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Recurso</TableHead>
            <TableHead>Comprador (Buyer)</TableHead>
            <TableHead>Proprietário (Owner)</TableHead>
            <TableHead>Corretor (Agent)</TableHead>
            <TableHead>Imobiliária (Agency)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Visualizar Imóveis</TableCell>
            <TableCell><Check className="h-5 w-5 text-green-500" /></TableCell>
            <TableCell><Check className="h-5 w-5 text-green-500" /></TableCell>
            <TableCell><Check className="h-5 w-5 text-green-500" /></TableCell>
            <TableCell><Check className="h-5 w-5 text-green-500" /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Cadastrar Imóveis</TableCell>
            <TableCell><X className="h-5 w-5 text-red-500" /></TableCell>
            <TableCell><Check className="h-5 w-5 text-green-500" /></TableCell>
            <TableCell><Check className="h-5 w-5 text-green-500" /></TableCell>
            <TableCell><Check className="h-5 w-5 text-green-500" /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Criar Buscas</TableCell>
            <TableCell><Check className="h-5 w-5 text-green-500" /></TableCell>
            <TableCell><X className="h-5 w-5 text-red-500" /></TableCell>
            <TableCell><X className="h-5 w-5 text-red-500" /></TableCell>
            <TableCell><X className="h-5 w-5 text-red-500" /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Ver Matches</TableCell>
            <TableCell><Check className="h-5 w-5 text-green-500" /></TableCell>
            <TableCell><Check className="h-5 w-5 text-green-500" /></TableCell>
            <TableCell><Check className="h-5 w-5 text-green-500" /></TableCell>
            <TableCell><Check className="h-5 w-5 text-green-500" /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Gerenciar Clientes</TableCell>
            <TableCell><X className="h-5 w-5 text-red-500" /></TableCell>
            <TableCell><X className="h-5 w-5 text-red-500" /></TableCell>
            <TableCell><Check className="h-5 w-5 text-green-500" /></TableCell>
            <TableCell><Check className="h-5 w-5 text-green-500" /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Gerenciar Corretores</TableCell>
            <TableCell><X className="h-5 w-5 text-red-500" /></TableCell>
            <TableCell><X className="h-5 w-5 text-red-500" /></TableCell>
            <TableCell><X className="h-5 w-5 text-red-500" /></TableCell>
            <TableCell><Check className="h-5 w-5 text-green-500" /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Análises Avançadas</TableCell>
            <TableCell><X className="h-5 w-5 text-red-500" /></TableCell>
            <TableCell><X className="h-5 w-5 text-red-500" /></TableCell>
            <TableCell><X className="h-5 w-5 text-red-500" /></TableCell>
            <TableCell><Check className="h-5 w-5 text-green-500" /></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTypeComparison;
