package com.example.skindisease.dto;

public class DoctorResponse {

    private String id;
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;
    private String mapsUrl;

    public DoctorResponse() {
    }

    public DoctorResponse(
            String id,
            String name,
            String address,
            Double latitude,
            Double longitude,
            String mapsUrl) {

        this.id = id;
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.mapsUrl = mapsUrl;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getMapsUrl() {
        return mapsUrl;
    }

    public void setMapsUrl(String mapsUrl) {
        this.mapsUrl = mapsUrl;
    }
}