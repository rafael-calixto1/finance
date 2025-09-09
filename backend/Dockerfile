FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline
COPY src ./src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
EXPOSE 8081
COPY --from=builder /app/target/finance-simulator-0.0.1-SNAPSHOT.jar .
ENTRYPOINT ["java","-jar","/app/finance-simulator-0.0.1-SNAPSHOT.jar"]
