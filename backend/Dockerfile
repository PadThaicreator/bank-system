FROM eclipse-temurin:17-jdk

WORKDIR /app
COPY . .

RUN ./gradlew build

EXPOSE 8080

CMD ["java", "-jar", "build/libs/demo-0.0.1-SNAPSHOT.jar"]