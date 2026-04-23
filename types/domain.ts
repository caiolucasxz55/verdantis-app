export type LotStatus = "Ativo" | "Finalizado" | "Em Preparo";

export interface Lote {
  id: string;
  name: string;
  crop: string;
  production: number;
  cost: number;
  salePrice: number;
  revenue: number;
  profit: number;
  margin: number;
  status: LotStatus;
  propertyName: string;
}

export interface LoteFormData {
  name: string;
  crop: string;
  production: number;
  cost: number;
  salePrice: number;
}

export type CropStatus = "Em Crescimento" | "Plantio" | "Pronto" | "Colheita";

export interface Cultivo {
  id: string;
  name: string;
  lot: string;
  lotId: string;
  farm: string;
  status: CropStatus;
  plantingDate: string;
  harvestDate: string;
  area: number;
  daysUntilHarvest: number;
  progress: number;
  irrigation: boolean;
  weather: boolean;
  variety: string;
  expectedYield: number;
  actualYield?: number;
  notes?: string;
  isComplete?: boolean;
  traceabilityHash?: TraceabilityHash;
  events?: TraceabilityEvent[];
}

export type TraceabilityEventType = "INPUT_ADDITION" | "IRRIGATION" | "HARVEST" | "OTHER";

export interface TraceabilityEvent {
  id: string;
  lotId: string;
  type: TraceabilityEventType;
  description: string;
  timestamp: Date;
}

export interface TraceabilityHash {
  lotId: string;
  hash: string;
  generatedAt: Date;
  eventCount: number;
}

export interface CropMarketData {
  id: string;
  name: string;
  imageUrl: string;
  pricePerSack: number;
  priceTrend: "up" | "down" | "stable";
}
