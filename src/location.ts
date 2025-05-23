const getGoogleMapsUrl = (locationName: string) => {
    const baseUrl = "https://www.google.com/maps/search/?api=1&query=";
    const encodedLocation = encodeURIComponent(locationName);
    return baseUrl + encodedLocation;
}

export const addLocationToDescription = (description: string) => {
    const locationRegex = /Lokalizacja:\s*(.+)/;
    const match = description.match(locationRegex);``

    if (match) {
        const location = match[1].trim();
        const googleMapsUrl = getGoogleMapsUrl(location);
        return `${description}\n${googleMapsUrl}`;
    }

    return description;
}