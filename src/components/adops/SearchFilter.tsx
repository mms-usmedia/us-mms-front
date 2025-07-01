import React from "react";

// Este componente ya no es necesario ya que la funcionalidad de búsqueda
// se ha integrado directamente en la página principal.
// El archivo se mantiene para compatibilidad con importaciones existentes.

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const SearchFilter = ({ searchTerm, setSearchTerm }: SearchFilterProps) => {
  return null;
};

export default SearchFilter;
