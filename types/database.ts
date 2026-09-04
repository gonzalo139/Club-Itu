export type EstadoSocio = "activo" | "inactivo" | "suspendido";
export type EstadoCuota = "pendiente" | "pagada" | "vencida" | "anulada";
export type MetodoPago = "efectivo" | "transferencia" | "otro";

export interface Categoria {
  id: string;
  nombre: string;
  monto_cuota: number;
  activa: boolean;
  created_at: string;
}

export interface Socio {
  id: string;
  nombre: string;
  apellido: string;
  dni: string | null;
  email: string | null;
  telefono: string | null;
  categoria_id: string;
  fecha_ingreso: string;
  estado: EstadoSocio;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface Cuota {
  id: string;
  socio_id: string;
  periodo: string;
  monto: number;
  estado: EstadoCuota;
  fecha_vencimiento: string;
  created_at: string;
}

export interface Pago {
  id: string;
  cuota_id: string | null;
  socio_id: string;
  monto: number;
  metodo: MetodoPago;
  fecha_pago: string;
  observaciones: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      categorias: {
        Row: Categoria;
        Insert: Omit<Categoria, "id" | "created_at">;
        Update: Partial<Omit<Categoria, "id" | "created_at">>;
      };
      socios: {
        Row: Socio;
        Insert: Omit<Socio, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Socio, "id" | "created_at" | "updated_at">>;
      };
      cuotas: {
        Row: Cuota;
        Insert: Omit<Cuota, "id" | "created_at">;
        Update: Partial<Omit<Cuota, "id" | "created_at">>;
      };
      pagos: {
        Row: Pago;
        Insert: Omit<Pago, "id" | "created_at">;
        Update: Partial<Omit<Pago, "id" | "created_at">>;
      };
    };
  };
}
