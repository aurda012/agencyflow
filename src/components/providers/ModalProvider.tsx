"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  type Plan,
  type Agency,
  type Contact,
  type User,
} from "@prisma/client";
import type { PriceList, TicketDetails } from "@/lib/types";
import { IUser } from "@/database/models/user.model";
import { IAgency } from "@/database/models/agency.model";
import { IContact } from "@/database/models/contact.model";
import { ITicket } from "@/database/models/ticket.model";

export interface ModalData {
  user?: IUser;
  agency?: IAgency;
  contact?: IContact;
  ticket?: ITicket;
  plans?: {
    defaultPriceId: Plan;
    plans: PriceList["data"];
  };
}

interface ModalContextType {
  data: ModalData;
  isOpen: boolean;
  setOpen: (modal: React.ReactNode, fetch?: () => Promise<any>) => void;
  setClose: () => void;
}

export const ModalContext = createContext<ModalContextType>({
  data: {},
  isOpen: false,
  setOpen: (modal: React.ReactNode, fetch?: () => Promise<any>) => {},
  setClose: () => {},
});

export const ModalProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [data, setData] = useState<ModalData>({});
  const [currentModal, setCurrentModal] = useState<React.ReactNode>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const setOpen: ModalContextType["setOpen"] = async (modal, fetch) => {
    if (modal) {
      if (fetch) {
        const newData = await fetch();
        setData({ ...data, ...newData } || {});
      }

      setCurrentModal(modal);
      setIsOpen(true);
    }
  };

  const setClose = () => {
    setIsOpen(false);
    setData({});
  };

  if (!isMounted) {
    return null;
  }

  return (
    <ModalContext.Provider value={{ data, setOpen, setClose, isOpen }}>
      {children}
      {currentModal}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within the modal provider");
  }
  return context;
};

export default ModalProvider;
