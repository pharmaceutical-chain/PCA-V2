// tslint:disable-next-line: class-name
export interface ITransfer_GET {
  id: string;
  from: string;
  fromId: string;
  to: string;
  toId: string;
  medicine: string;
  batchNumber: string;
  quantity: number;
  unit: string;
  isConfirmed: boolean;
  medicineBatchId: string;

  registrationCode: string;
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
  
  toAddress: string;
  toCA: string;

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
  isConfirmed: boolean;
}

// tslint:disable-next-line: class-name
export interface ITransfer_SEARCH {
  to: string;

  batchId: string;
  batchNumber: string;
  manufactureDate: string;
  expiryDate: string
  quantity: number;
  unit: string;

  manufacturerId: string;
  manufacturerCode: string;
  manufacturer: string;

  medicineId: string;
  medicineCode: string;
  commercialName: string;
  ingredientConcentration: string;
}