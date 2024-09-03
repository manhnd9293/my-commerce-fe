gcloud config configurations activate default
docker build -t asia-southeast1-docker.pkg.dev/test-gcp-new-432115/my-commerce/my-commerce-fe:latest --platform linux/amd64 .
docker push asia-southeast1-docker.pkg.dev/test-gcp-new-432115/my-commerce/my-commerce-fe:latest
docker rmi asia-southeast1-docker.pkg.dev/test-gcp-new-432115/my-commerce/my-commerce-fe
gcloud run deploy my-commerce-fe --image=asia-southeast1-docker.pkg.dev/test-gcp-new-432115/my-commerce/my-commerce-fe:latest --region=asia-southeast1 --project=test-gcp-new-432115
