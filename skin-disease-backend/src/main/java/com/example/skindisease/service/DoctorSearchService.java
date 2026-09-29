package com.example.skindisease.service;

import com.example.skindisease.dto.DoctorResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class DoctorSearchService {

    @Value("${google.maps.api.key}")
    private String googleApiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public DoctorSearchService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public List<DoctorResponse> findNearbyDoctors(
            double latitude,
            double longitude,
            String specialistType) {

        List<DoctorResponse> doctors = new ArrayList<>();

        try {

            String url =
                    "https://places.googleapis.com/v1/places:searchNearby";

            // -----------------------------------------
            // REQUEST BODY
            // -----------------------------------------

            String requestBody = """
                    {
                      "includedTypes": ["doctor"],
                      "maxResultCount": 10,
                      "rankPreference": "DISTANCE",
                      "locationRestriction": {
                        "circle": {
                          "center": {
                            "latitude": %s,
                            "longitude": %s
                          },
                          "radius": 10000
                        }
                      }
                    }
                    """.formatted(latitude, longitude);

            // -----------------------------------------
            // HEADERS
            // -----------------------------------------

            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(MediaType.APPLICATION_JSON);

            headers.set(
                    "X-Goog-Api-Key",
                    googleApiKey
            );

            headers.set(
                    "X-Goog-FieldMask",
                    "places.id," +
                    "places.displayName," +
                    "places.formattedAddress," +
                    "places.location," +
                    "places.googleMapsUri," +
                    "places.nationalPhoneNumber," +
                    "places.rating"
            );

            // -----------------------------------------
            // HTTP REQUEST
            // -----------------------------------------

            HttpEntity<String> entity =
                    new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.POST,
                            entity,
                            String.class
                    );

            // -----------------------------------------
            // READ RESPONSE
            // -----------------------------------------

            JsonNode root =
                    objectMapper.readTree(response.getBody());

            JsonNode places =
                    root.path("places");

            if (places.isArray()) {

                for (JsonNode place : places) {

                    String id =
                            place.path("id").asText("");

                    String name =
                            place.path("displayName")
                                 .path("text")
                                 .asText("Doctor / Clinic");

                    String address =
                            place.path("formattedAddress")
                                 .asText("Address unavailable");

                    String mapsUrl =
                            place.path("googleMapsUri")
                                 .asText("");

                    Double placeLatitude = null;
                    Double placeLongitude = null;

                    if (place.has("location")) {

                        placeLatitude =
                                place.path("location")
                                     .path("latitude")
                                     .asDouble();

                        placeLongitude =
                                place.path("location")
                                     .path("longitude")
                                     .asDouble();
                    }

                    doctors.add(
                            new DoctorResponse(
                                    id,
                                    name,
                                    address,
                                    placeLatitude,
                                    placeLongitude,
                                    mapsUrl
                            )
                    );
                }
            }

        } catch (Exception e) {

            System.out.println(
                    "Google Places API Error: "
                            + e.getMessage()
            );

            e.printStackTrace();
        }

        return doctors;
    }
}