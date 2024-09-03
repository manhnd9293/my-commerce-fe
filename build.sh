gcloud config configurations activate default
docker build -t my-commerce-fe --platform linux/amd64 .
docker tag my-commerce-fe asia-southeast1-docker.pkg.dev/test-gcp-new-432115/my-commerce/my-commerce-fe:latest
docker push asia-southeast1-docker.pkg.dev/test-gcp-new-432115/my-commerce/my-commerce-fe:latest
