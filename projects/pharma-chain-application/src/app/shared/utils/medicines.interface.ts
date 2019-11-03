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