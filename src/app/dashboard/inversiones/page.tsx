'use client';

import React from 'react';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { investments, Investment } from '@/lib/data'; 
import Link from 'next/link';

const getStatusVariant = (status: Investment['status']) => {
  switch (status) {
    case 'Activa':
      return 'default';
    case 'Finalizada':
      return 'secondary';
    case 'Liquidada':
      return 'outline';
    default:
      return 'default';
  }
};

export default function InversionesPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Inversiones</CardTitle>
                <CardDescription>Gestiona todas las inversiones de capital.</CardDescription>
            </div>
            <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Agregar Inversión
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Inversionista</TableHead>
              <TableHead className="text-right">Monto Invertido</TableHead>
              <TableHead className="text-center">Tasa Anual (%)</TableHead>
              <TableHead>Periodicidad</TableHead>
              <TableHead className="text-right">Interés del Cupón (Bruto)</TableHead>
              <TableHead className="text-right">Retención del Cupón (15%)</TableHead>
              <TableHead className="text-right">Monto del Cupón (Neto)</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investments.map((investment) => (
              <InvestmentTableRow key={investment.investmentNumber} investment={investment} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function InvestmentTableRow({ investment }: { investment: Investment }) {
  const annualInterest = investment.amount * (investment.rate / 100);
  let periodsPerYear = 1;
  switch (investment.interestFrequency) {
    case 'Mensual':
      periodsPerYear = 12;
      break;
    case 'Trimestral':
      periodsPerYear = 4;
      break;
    case 'Semestral':
      periodsPerYear = 2;
      break;
    case 'Anual':
      periodsPerYear = 1;
      break;
  }
  
  const couponInterestBruto = annualInterest / periodsPerYear;
  const couponRetention = couponInterestBruto * 0.15;
  const couponPaymentNeto = couponInterestBruto - couponRetention;
  
  return (
      <TableRow className="hover:bg-muted/50">
        <TableCell>
          <Link
            href={`/dashboard/inversiones/${investment.investmentNumber}`}
            className="font-medium hover:underline"
          >
            {investment.investorName}
          </Link>
          <div className="text-sm text-muted-foreground">{investment.investmentNumber}</div>
        </TableCell>
        <TableCell className="text-right font-mono">
          {new Intl.NumberFormat('es-CR', { style: 'currency', currency: investment.currency }).format(investment.amount)}
        </TableCell>
        <TableCell className="text-center font-mono">{investment.rate.toFixed(2)}%</TableCell>
        <TableCell>{investment.interestFrequency}</TableCell>
        <TableCell className="text-right font-mono">
            {new Intl.NumberFormat('es-CR', { style: 'currency', currency: investment.currency }).format(couponInterestBruto)}
        </TableCell>
        <TableCell className="text-right font-mono text-destructive">
            - {new Intl.NumberFormat('es-CR', { style: 'currency', currency: investment.currency }).format(couponRetention)}
        </TableCell>
        <TableCell className="text-right font-mono font-semibold text-primary">
            {new Intl.NumberFormat('es-CR', { style: 'currency', currency: investment.currency }).format(couponPaymentNeto)}
        </TableCell>
        <TableCell>
          <Badge variant={getStatusVariant(investment.status)}>
            {investment.status}
          </Badge>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Alternar menú</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/inversiones/${investment.investmentNumber}`}>
                  Ver Detalles
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Ver Cupones</DropdownMenuItem>
              <DropdownMenuItem>Liquidar Anticipadamente</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
  );
}
