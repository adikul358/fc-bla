# Founder's Club Backend Lead Assignment

### Objectives
1. `/api` endpoint returns a JSON array of the episode data of _The Last of Us_ season 2 (a show I am currently watching).
2. `/signup`, `/signin`, `/signout` manage authentication flow using JWT session cookies.
3. If logged in, `/api/me` returns the JSON array of episodes, including your ratings. Otherwise it redirects to `/api`
4. Users are stored in memory in an array, their passwords hashed with a salt using the `bcrypt` library

### Usage

You can use the API hosted on [fc-bla.projects.adikul.dev](fblt.projects.adikul.dev) with any API client. An HAR (HTTP Archive Format) file with test queries is included.
 
SS


### Setup

To install dependencies:

```bash
bun install
```

To run development:

```bash
bun dev
```

To run production:

```bash
bun start
```

This project was created using `bun init` in bun v1.2.6. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

### Deployment

The project can be deployed as a Docker container on a service like GCP Cloud Run.

Setup GCP Local CLI
```
gcloud config set project [PROJECT_ID]
gcloud services enable artifactregistry.googleapis.com
gcloud auth configure-docker
```

Build container and push to registry
```
docker build -t [REGION]-docker.pkg.dev/[PROJECT_ID]/[REPO_NAME]/[IMAGE_NAME]:[TAG] .
docker push [REGION]-docker.pkg.dev/[PROJECT_ID]/[REPO_NAME]/[IMAGE_NAME]:[TAG]
gcloud container images list --repository=gcr.io/[PROJECT_ID]
```