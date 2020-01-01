// tslint:disable-next-line: class-name
export interface IBatch_GET {
  id: string;
  batchNumber: string;
  medicineId: string;
  commercialName: string;
  ingredientConcentration: string;
  manufacturerId: string;
  manufacturer: string;
  manufactureDate: string;
  expiryDate: string;
  quantity: number;
  unit: string;
  certificates: string;
  transactionHash: string;
  contractAddress: string;
  dateCreated: string;
  transactionStatus: string;
}

// tslint:disable-next-line: class-name
export interface IBatch_CREATE {
  batchNumber: string;
  medicineId: string;
  manufacturerId: string;
  manufactureDate: string;
  expiryDate: string
  quantity: number;
  unit: string;
  certificates: string;
}

// tslint:disable-next-line: class-name
export interface IBatch_SEARCH {
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