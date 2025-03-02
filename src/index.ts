import { $Enums, PrismaClient, Prisma } from '@prisma/client';

console.log('Hello, world!');
const prisma = new PrismaClient();

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

getCitiesWithPopulationGreaterThan(9_000_000);
