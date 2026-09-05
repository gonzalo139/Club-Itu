export function generarCsv(encabezados: string[], filas: (string | number)[][]) {
  const escapar = (valor: string | number) => {
    const texto = String(valor);
    if (/[",\n;]/.test(texto)) {
      return `"${texto.replace(/"/g, '""')}"`;
    }
    return texto;
  };

  const lineas = [encabezados, ...filas].map((fila) => fila.map(escapar).join(","));
  // BOM para que Excel detecte UTF-8 y muestre bien las tildes/ñ.
  return "﻿" + lineas.join("\r\n");
}
