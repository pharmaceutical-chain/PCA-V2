// tslint:disable-next-line: class-name
export interface IMedicine_GET {
  id: string;
  registrationCode: string;
  commercialName: string;
  ingredientConcentration: string;
  isPrescriptionMedicine: boolean;
  manufacturer: string;
  dosageForm: string;
  packingSpecification: string;
  declaredPrice: string;
  manufacturerAddress: string;
  
  transactionHash: string;
  contractAddress: string;
  dateCreated: string;
  transactionStatus: string;
}

// tslint:disable-next-line: class-name
export interface IMedicine_CREATE {
  commercialName: string,
  registrationCode: string,
  isPrescriptionMedicine: boolean,
  dosageForm: string,
  ingredientConcentration: string,
  packingSpecification: string,
  declaredPrice: string,
  currentlyLoggedInTenant: string
}