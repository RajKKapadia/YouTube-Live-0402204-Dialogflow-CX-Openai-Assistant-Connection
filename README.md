# GCP Cloud Functions

## Start building the function
```bash
npm install @google-cloud/functions-framework
```

## Run the function locally
```bash
FUNCTION_TARGET=webhook npx @google-cloud/functions-framework
```

## Deploy on gcloud
```bash
gcloud functions deploy "webhook" --trigger-http --runtime="nodejs20"
```