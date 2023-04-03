export class PropertyTypeDTO {
  constructor(
    public id: number,
    public name: string
  ) {}
}

export class PropertyDTO {
  constructor(
    public id: number,
    public propertyTypeId: number,
    public propertyTypeName: string,
    public name: string,
    public description: string,
    public active: boolean,
    public propertyTypeDTO: PropertyTypeDTO
  ) {}
}

export class PropertyListingDTO {
  constructor(
    public propertyListingId: number,
    public floors: number,
    public totalUnits: number,
    public availableUnits: number,
    public description: string,
    public propertyId: number,
    public roomTypeId: number,
    public roomTypeDTO: RoomTypeDTO,
    public published: boolean,
    public acceptsPayment: boolean
  ) {}
}

export class RoomTypeDTO {
  constructor(
    public id: number,  
    public name: string,
    public bathRooms: number,
    public bedRooms: number,
    public kitchens: number
  ) {}
}

export class PropertyFeatureDTO {
  constructor(
    public id: number,
    public name: string
  ) {}
}

export class PropertyListingFeatureDTO {
  constructor(
    public id: number,
    public name: string
  ) {}
}

export class LocationDTO {
  constructor(
    public locationId: number,
    public countyId: number,
    public propertyId: number,
    public countyName: string,
    public town: string,
    public suburb: string,
    public areaName: string,
    public additionalInfo: string,
    public street: string,
    public latitude: number,
    public longitude: number
  ) {}
}

export class RentalCostDTO {
  constructor(
    public id: number,
    public minAmount: number,
    public exactAmount: number,
    public maxAmount: number,
    public propertyListingId: number
  ) {}
}
export class ElectricityCostDTO {
  constructor(
    public id: number,
    public propertyListingId: number,
    public fixedAmount: number,
    public installationTypeId: number,
    public installationTypeName: string
  ) {}
}

export class WaterCostDTO {
  constructor(
    public id: number,
    public fixedAmount: number,
    public unitSizeInLitres: number,
    public pricePerUnit: number,
    public frequencyPerMonth: number,
    public propertyListingId: number,
    public waterAvailabilityId: number,
    public waterAvailability: string
  ) {}
}

export class AdditionalCostDTO {
  constructor(
    public id: number,
    public item: string,
    public amount: number,
    public amountIsApproximate: boolean,
    public description: string,
    public propertyListingId: number
  ) {}
}

export class ElectricityInstallationTypeDTO {
  constructor(
    public id: number,
    public name: string
  ) {}
}

export class WaterAvailabilityTypeDTO {
  constructor(
    public id: number,
    public name: string
  ) {}
}
