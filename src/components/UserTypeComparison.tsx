
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
import { Check, X, Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const UserTypeComparison = () => {
  return (
    <div className="w-full overflow-auto bg-white rounded-md shadow p-4">
      <div className="mb-6 p-4 bg-blue-100 border-l-4 border-blue-500 rounded-md">
        <h3 className="flex items-center gap-2 text-lg font-semibold mb-2 text-blue-800">
          <Info className="h-5 w-5 text-blue-600" />
          Entendendo os tipos de usuário
        </h3>
        <p className="text-sm text-blue-700">
          Abaixo você pode ver as diferenças entre os diferentes tipos de usuário e suas permissões no sistema.
          Cada tipo tem funcionalidades específicas para suas necessidades. Verifique qual tipo se adequa melhor ao seu caso.
        </p>
      </div>
      
      <Table className="border border-gray-200 shadow-sm">
        <TableCaption className="text-base font-medium">Comparação entre os diferentes tipos de usuários</TableCaption>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[200px] border-r font-bold text-primary">Recurso</TableHead>
            <TableHead className="border-r">
              <div className="flex flex-col items-center">
                <span className="font-bold text-primary">Comprador</span>
                <span className="text-xs text-muted-foreground">(Buyer)</span>
              </div>
            </TableHead>
            <TableHead className="border-r">
              <div className="flex flex-col items-center">
                <span className="font-bold text-primary">Proprietário</span>
                <span className="text-xs text-muted-foreground">(Owner)</span>
              </div>
            </TableHead>
            <TableHead className="border-r">
              <div className="flex flex-col items-center">
                <span className="font-bold text-primary">Corretor</span>
                <span className="text-xs text-muted-foreground">(Agent)</span>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex flex-col items-center">
                <span className="font-bold text-primary">Imobiliária</span>
                <span className="text-xs text-muted-foreground">(Agency)</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="hover:bg-gray-50">
            <TableCell className="font-medium border-r">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-left flex items-center underline decoration-dotted">
                    Visualizar Imóveis
                  </TooltipTrigger>
                  <TooltipContent className="bg-primary-foreground border-primary">
                    <p className="max-w-xs">Ver detalhes de imóveis disponíveis na plataforma</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell className="text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></TableCell>
            <TableCell className="text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></TableCell>
            <TableCell className="text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></TableCell>
            <TableCell className="text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></TableCell>
          </TableRow>
          <TableRow className="hover:bg-gray-50">
            <TableCell className="font-medium border-r">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-left flex items-center underline decoration-dotted">
                    Cadastrar Imóveis
                  </TooltipTrigger>
                  <TooltipContent className="bg-primary-foreground border-primary">
                    <p className="max-w-xs">Adicionar e gerenciar imóveis para venda ou aluguel</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell className="text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></TableCell>
            <TableCell className="text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></TableCell>
            <TableCell className="text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></TableCell>
            <TableCell className="text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></TableCell>
          </TableRow>
          <TableRow className="hover:bg-gray-50">
            <TableCell className="font-medium border-r">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-left flex items-center underline decoration-dotted">
                    Criar Buscas
                  </TooltipTrigger>
                  <TooltipContent className="bg-primary-foreground border-primary">
                    <p className="max-w-xs">Definir critérios de busca para encontrar imóveis ideais</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell className="text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></TableCell>
            <TableCell className="text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></TableCell>
            <TableCell className="text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></TableCell>
            <TableCell className="text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></TableCell>
          </TableRow>
          <TableRow className="hover:bg-gray-50">
            <TableCell className="font-medium border-r">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-left flex items-center underline decoration-dotted">
                    Ver Matches
                  </TooltipTrigger>
                  <TooltipContent className="bg-primary-foreground border-primary">
                    <p className="max-w-xs">Visualizar correspondências entre buscas e imóveis disponíveis</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell className="text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></TableCell>
            <TableCell className="text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></TableCell>
            <TableCell className="text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></TableCell>
            <TableCell className="text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></TableCell>
          </TableRow>
          <TableRow className="hover:bg-gray-50">
            <TableCell className="font-medium border-r">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-left flex items-center underline decoration-dotted">
                    Gerenciar Clientes
                  </TooltipTrigger>
                  <TooltipContent className="bg-primary-foreground border-primary">
                    <p className="max-w-xs">Acompanhar e organizar clientes interessados em imóveis</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell className="text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></TableCell>
            <TableCell className="text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></TableCell>
            <TableCell className="text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></TableCell>
            <TableCell className="text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></TableCell>
          </TableRow>
          <TableRow className="hover:bg-gray-50">
            <TableCell className="font-medium border-r">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-left flex items-center underline decoration-dotted">
                    Gerenciar Corretores
                  </TooltipTrigger>
                  <TooltipContent className="bg-primary-foreground border-primary">
                    <p className="max-w-xs">Administrar equipe de corretores e suas atividades</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell className="text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></TableCell>
            <TableCell className="text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></TableCell>
            <TableCell className="text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></TableCell>
            <TableCell className="text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></TableCell>
          </TableRow>
          <TableRow className="hover:bg-gray-50">
            <TableCell className="font-medium border-r">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-left flex items-center underline decoration-dotted">
                    Análises Avançadas
                  </TooltipTrigger>
                  <TooltipContent className="bg-primary-foreground border-primary">
                    <p className="max-w-xs">Acessar relatórios e estatísticas detalhadas sobre o mercado imobiliário</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell className="text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></TableCell>
            <TableCell className="text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></TableCell>
            <TableCell className="text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></TableCell>
            <TableCell className="text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTypeComparison;
