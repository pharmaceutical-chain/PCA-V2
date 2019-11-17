// tslint:disable-next-line: class-name
export interface ITenant_GET {
  id: string;
  name: string;
  primaryAddress: string;
  branchAddresses?: string;
  phoneNumber?: string;
  taxCode: string;
  registrationCode: string;
  goodPractices?: string;
  
  transactionHash: string;
  contractAddress: string;
  type: string;
  dateCreated: string;
  transactionStatus: string
}

// tslint:disable-next-line: class-name
export interface ITenant_CREATE {
  name: string;
  primaryAddress: string;
  branchAddresses?: string;
  phoneNumber?: string;
  taxCode: string;
  registrationCode: string;
  goodPractices: string;
  type: string;
  email: string
}