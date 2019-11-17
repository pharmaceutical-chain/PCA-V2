// tslint:disable-next-line: class-name
export interface ITransfer_GET {
  id: string;
  from: string;
  to: string;
  medicine: string;
  batchNumber: string;
  quantity: number;

  registrationCode: string;
  isPrescriptionMedicine: boolean;
  ingredientConcentration: string;
  declaredPrice: number;
  medicineCA: string;
  registeredBy: string;
  registeredByCA: string;

  madeBy: string;
  madeByCA: string;
  madeIn: string;
  manufactureDate: string;
  expiryDate: string;
  batchCA: string;

  fromAddress: string;
  fromCA: string;
  
  transactionHash: string;
  contractAddress: string;
  date: string;
  time: string;
  transactionStatus: string;
}

// tslint:disable-next-line: class-name
export interface ITransfer_CREATE {
  medicineBatchId: string;
  fromTenantId: string;
  toTenantId: string;
  quantity: number;
}