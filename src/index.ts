import { $Enums, PrismaClient, Prisma } from '@prisma/client';

console.log('Hello, world!');
const prisma = new PrismaClient().$extends({
    result: {
        country: {
            density: {
                needs: {
                    population: true,
                    surfaceArea: true,
                },
                compute(item) {
                    return item.population / item.surfaceArea.toNumber();
                },
            },
        },
    },
});

export const getCountries = async () => {
    const countries = await prisma.country.findMany();
    console.log(countries);
};

const selectOptions: Prisma.CountrySelect = {
    code: true,
    name: true,
    capital: true,
};

export const getCountriesByContinents = async (
    continent: $Enums.CountryContinent,
) => {
    const countries = await prisma.country.findMany({
        where: {
            continent: continent,
        },
        select: selectOptions,
    });
    console.log(countries);
};

const omitOptions: Prisma.CityOmit = {
    id: true,
    countryCode: true,
};

export const getCitiesByCountryCode = async (countryCode: string) => {
    const cities = await prisma.city.findMany({
        where: { countryCode },
        omit: omitOptions,
    });
    console.log(cities);
};

export const getCitiesFromContinentWithCountryName = async (
    continent: $Enums.CountryContinent,
) => {
    const cities = await prisma.city.findMany({
        omit: omitOptions,
        include: {
            country: {
                select: {
                    name: true,
                },
            },
        },
        where: {
            country: {
                continent,
            },
        },
    });

    console.log(cities);
};

export const getCitiesWithPopulationGreaterThan = async (limit: number) => {
    const cities = await prisma.city.findMany({
        omit: omitOptions,
        where: {
            population: {
                gt: limit,
            },
        },
    });

    console.log(cities);
};

// await getCountries();
// await getCountriesByContinents('Europe');

// await getCitiesByCountryCode('ESP');
// await getCitiesFromContinentWithCountryName('Europe');

// getCitiesWithPopulationGreaterThan(9_000_000);

// Listado de países de continente con su nombre, población y densidad

export const getCitiesWithDensityByContinent = async (
    continent: $Enums.CountryContinent,
) => {
    const countries = await prisma.country.findMany({
        select: {
            name: true,
            population: true,
            surfaceArea: true,
        },
        where: {
            continent: continent,
        },
    });
    console.log(countries);
    // console.log(
    //     countries.map((country) => {
    //         const density = country.population / country.surfaceArea.toNumber();
    //         return {
    //             ...country,
    //             density,
    //         };
    //     }),
    // );
};

// getCitiesWithDensityByContinent('Europe');

// Nombre de la ciudad, país y su forma de gobierno
// de las ciudades de más de x habitantes de z continente

export const getCitiesPoliticsWithPopulationGreaterThan = async (
    limit: number,
    continent: $Enums.CountryContinent,
) => {
    const cities = await prisma.city.findMany({
        select: {
            name: true,
            country: {
                select: {
                    name: true,
                    governmentForm: true,
                },
            },
        },
        where: {
            country: {
                population: limit,
                continent: continent,
            },
        },
    });
    console.log(cities);
};

// Cual es la superficie y población de cada continente

const getContinentSurfaceAndPopulation = async () => {
    const groupUsers = await prisma.country.groupBy({
        by: ['continent'],
        _sum: {
            population: true,
            surfaceArea: true,
        },
        _avg: {
            population: true,
            surfaceArea: true,
        },
    });
    console.log(groupUsers);
};

getContinentSurfaceAndPopulation();
