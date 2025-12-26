"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";
import { Team } from "@/types/schema";

interface SessionCreationData {
  sessionName: string;
  centralHub: string;
  date: string;
  address: string;
  description: string;
  teams: Team[];
}

interface SessionCreationContextType {
  data: SessionCreationData;
  updateBasicInfo: (
    sessionName: string,
    centralHub: string,
    date: string,
    address: string,
    description: string,
  ) => void;
  updateTeams: (teams: Team[]) => void;
  addTeam: () => void;
  deleteTeam: (index: number) => void;
  reset: () => void;
}

const defaultData: SessionCreationData = {
  sessionName: "",
  centralHub: "",
  date: "",
  address: "",
  description: "",
  teams: [],
};

const SessionCreationContext = createContext<
  SessionCreationContextType | undefined
>(undefined);

export function SessionCreationProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SessionCreationData>(defaultData);

  const updateBasicInfo = (
    sessionName: string,
    centralHub: string,
    date: string,
    address: string,
    description: string,
  ) => {
    setData(prev => ({
      ...prev,
      sessionName,
      centralHub,
      date,
      address,
      description,
    }));
  };

  const updateTeams = (teams: Team[]) => {
    setData(prev => ({
      ...prev,
      teams,
    }));
  };

  const addTeam = () => {
    setData(prev => ({
      ...prev,
      teams: [...prev.teams, { type: "Type A", size: 5, time: "1 hour" }],
    }));
  };

  const deleteTeam = (index: number) => {
    setData(prev => ({
      ...prev,
      teams: prev.teams.filter((_, i) => i !== index),
    }));
  };

  const reset = () => {
    setData(defaultData);
  };

  return (
    <SessionCreationContext.Provider
      value={{
        data,
        updateBasicInfo,
        updateTeams,
        addTeam,
        deleteTeam,
        reset,
      }}
    >
      {children}
    </SessionCreationContext.Provider>
  );
}

export function useSessionCreation() {
  const context = useContext(SessionCreationContext);
  if (context === undefined) {
    throw new Error(
      "useSessionCreation must be used within a SessionCreationProvider",
    );
  }
  return context;
}
