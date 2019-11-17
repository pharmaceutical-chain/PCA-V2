// tslint:disable-next-line: class-name
export interface IBatch_GET {
  id: string;
  batchNumber: string;
  commercialName: string;
  ingredientConcentration: string;
  manufacturer: string;
  manufactureDate: string;
  expiryDate: string;
  quantity: number;
  unit: string;
  
  transactionHash: string;
  contractAddress: string;
  dateCreated: string;
  transactionStatus: string;

  manufacturerId: string;
  medicineId: string;
}

// tslint:disable-next-line: class-name
export interface IBatch_CREATE {
  batchNumber: string;
  medicineId: string;
  manufacturerId: string;
  manufactureDate: string;
  expiryDate: string
  quantity: number;
  unit: string
}