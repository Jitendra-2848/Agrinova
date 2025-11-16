import fs from "fs";
import csv from "csvtojson";

const inputFile = "./data/pincodes.csv";   
const outputFile = "./data/pincodes.json"; 

const convertCsvToJson = async () => {
  try {
    const jsonArray = await csv().fromFile(inputFile);

    const cleanedData = jsonArray
      .filter(row => row.Latitude && row.Longitude) // remove empty coords
      .map(({ DivisionName, ...rest }) => ({
        ...rest,
        Latitude: parseFloat(rest.Latitude),
        Longitude: parseFloat(rest.Longitude),
      }));

    fs.writeFileSync(outputFile, JSON.stringify(cleanedData, null, 2));

    console.log(`CSV converted successfully!`);
  
  }
  catch (err) {
    console.error("Error converting :", err);
  }
};

convertCsvToJson();
