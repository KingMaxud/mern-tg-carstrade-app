export function getYears(min: number, max: number) {
   const years: number[] = []
   for (let i = min; i <= max; i++) {
      years.push(i)
   }
   return years.reverse()
}

export const conditions = ['Used', 'New', 'Used & New']

export const bodyStyles = [
   'Sedan',
   'Wagon',
   'Hatchback',
   'SUV',
   'Coupe',
   'Minivan',
   'Pickup truck',
   'Convertible',
   'Cargo van'
]

export const colors = [
   {
      color: 'Beige',
      hex: '#eed9c4'
   },
   {
      color: 'Black',
      hex: '#000000'
   },
   {
      color: 'Blue',
      hex: '#0000ff'
   },
   {
      color: 'Brown',
      hex: '#6E260E'
   },
   {
      color: 'Gray',
      hex: '#808080'
   },
   {
      color: 'Green',
      hex: '#008000'
   },
   {
      color: 'Orange',
      hex: '#FFA500'
   },
   {
      color: 'Red',
      hex: '#FF0000'
   },
   {
      color: 'Silver',
      hex: '#C0C0C0'
   },
   {
      color: 'White',
      hex: '#FFFFFF'
   },
   {
      color: 'Yellow',
      hex: '#FFFF00'
   }
]

export const fuelTypes = ['Diesel', 'Gasoline', 'Electric', 'Hybrid']
export const driveInits = ['4WD', 'FWD', 'RWD']
export const transmission = ['Manual', 'Automatic', 'Robot', 'Variator']

let engineCapacityTemp: number[] = []

for (let i = 0.8; i < 7; i += 0.1) {
   engineCapacityTemp.push(Math.round(i * 10) / 10)
}

export const engineCapacity = engineCapacityTemp

const engineCapacitiesFilter = [
   1, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8, 3, 3.5, 4, 4.5, 5, 5.5, 6,
   6.5
]

export function getEngineCapacities(min:number, max: number) {
   return engineCapacitiesFilter.filter(e => e >= min && e <= max)
}

// Prices for Home Filter
export const prices = [
   500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 8000, 10000, 12500,
   15000, 17500, 20000, 25000, 30000, 40000, 50000, 60000, 70000, 80000, 90000,
   100000, 125000, 150000, 175000, 200000
]

// Prices for Advanced Filter
export function getPrices(min: number, max: number) {
   return prices.filter(price => price >= min && price <= max)
}

const mileages = [
   5000, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000,
   125000, 150000, 175000, 200000, 250000, 300000
]

export function getMileages(min: number, max: number) {
   return mileages.filter(mileage => mileage >= min && mileage <= max)
}

export const sorts = [
   {
      name: 'Latest offers',
      key: 'createdAt',
      direction: '-1'
   },
   {
      name: 'Price ascending',
      key: 'price',
      direction: '1'
   },
   {
      name: 'Price descending',
      key: 'price',
      direction: '-1'
   },
   {
      name: 'Newest cars',
      key: 'year',
      direction: '-1'
   },
   {
      name: 'Mileage ascending',
      key: 'mileage',
      direction: '1'
   }
]

export const filterKeys = [
   'mark',
   'model',
   'generation',
   'condition',
   'maxPrice',
   'minPrice',
   'maxYear',
   'minYear',
   'minMileage',
   'maxMileage',
   'color',
   'bodyStyle',
   'transmission',
   'fuelType',
   'driveInit',
   'minEngineCapacity',
   'maxEngineCapacity',
   'minPower',
   'maxPower'
]

export const arrayKeys = [
   'generation',
   'condition',
   'color',
   'bodyStyle',
   'transmission',
   'fuelType',
   'driveInit'
]

const powers = [100, 150, 200, 250, 300, 350, 400, 500, 600]

export function getPowers(min: number, max:number) {
   return powers.filter(p => p >= min && p <= max)
}
