# Bazos-updater

Automatically updates [bazos](https://www.bazos.sk) listings. Update is a timer triggered Azure Function that runs every week.

## Prerequisites

You need the following infrastructure:

1. Azure Storage Account (general purpose v2)
1. Azure Function App (NodeJS 12, Linux recommended but should be possible to run on Windows with some config changes)
1. Azure Cosmos DB (MongoDB API)

## Usage

1. Deploy Azure infrastructure as described in [Prerequisites](#prerequisites)
1. Add content to Cosmos DB and Storage Account as described in [Data](#data)
1. If you want to run function in Azure, deploy the function to Azure using prefered method. Make sure [remote build](https://docs.microsoft.com/en-us/azure/azure-functions/functions-deployment-technologies#remote-build) is enabled
1. Set required environment variables as described in [Environment variables](#environment-variables)
1. Run function:
   - `LOCALLY`: See [docs](https://docs.microsoft.com/en-us/azure/azure-functions/functions-develop-local)
   - `AZURE`: Wait for function execution, or [trigger function manually](https://docs.microsoft.com/en-us/azure/azure-functions/functions-manually-run-non-http)

## Environment variables

Local environment variables are set either in `local.settings.json` or in `.env` file. Azure environment variables are set in [Azure Function App configuration](https://docs.microsoft.com/en-us/azure/azure-functions/functions-how-to-use-azure-function-app-settings).

Some variables are needed for app to run properly, others are optional but may also be needed if you use different configuration:

### required

- `USER_INFO_NAME`: name displayed in listing
- `USER_INFO_EMAIL`: email displayed in listing
- `USER_INFO_PHONE_NUMBER`: phone number displayed in listing
- `USER_INFO_ZIP_CODE`: zip code displayed in listing
- `USER_INFO_PASSWORD`: password to edit / delete listing
- `BLOB_STORAGE_CONNECTION_STRING`: Azure Blob Storage connection string
- `BLOB_STORAGE_CONTAINER_NAME`: Azure Blob Storage container name
- `DB_CONNECTION_STRING`: Azure Cosmos Db connection string
- `COOKIE_BKOD`: `bkod` cookie used for bazos sms verification bypass

### optional

- `AZURE_FUNCTIONS_ENVIRONMENT`: developement environment
- `COOKIE_VALIDATION_URL`: URL used to validate that `COOKIE_BKOD` value is valid
- `DB_NAME`: name of the Azure Cosmos Db
- `DB_COLLECTION`: name of the collection where data is stored in Azure Cosmos Db
- `BASE_DOWNLOAD_FOLDER`: folder where downloads are saved (in Azure it has to be path in tmp folder i.e. /tmp/ in Linux)

## Data

Currently there is no frontend nor API that allows adding data, so data have to be fed manually into storage (listing pictures) and DB (listing data).

### Storage - stores listing pictures

Listing pictures are stored in Azure gereral purpose storagev2 in Blob Container:

1. Create a Blob Container
1. Upload pictures. Folders inside containers are also supported, so you may choose to upload to folder.

### DB - stores listing data

1. Create new Database
1. Create new Collection inside Database
1. Add document in the following format for each listing:

   ```ts
   {
      id: string; // "1"
      images?: string[]; // ["img1.jpg", "img2.jpg"] - OPTIONAL, should match the name of the images stored in Azure Storage
      folder?: string; // "car" - OPTIONAL, should match the folder where images are saved in Azure Storage
      data: {
         category: string; // "cars" - should match existing bazos category (check first part of URL of desired category).
         subCategory: string; // "Audi" - should match existing bazos subcategory (check category dropdown in selected category)
         title: string; // "my Audi"
         description: string; // "I'm selling this Audi..." - new lines should be replaced by \n characters
         price: number; // 1000
      };
   }
   ```
