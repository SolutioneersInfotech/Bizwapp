"use client";

import React, { createContext, useContext, useState } from "react";

const SidebarContext = createContext(null);

export const SidebarProvider = ({ children }) => {
  const [state, setState] = useState({ isOpen: true });

  return (
    <SidebarContext.Provider value={{ state, setState }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
      throw new Error("useSidebar must be used within a SidebarProvider.");
    }
    return context;
  };