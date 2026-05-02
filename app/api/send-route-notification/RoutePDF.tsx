import {
  Document,
  Link,
  Page,
  Image as PdfImage,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#222",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 12,
    color: "#555",
    marginBottom: 16,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 16,
  },
  section: {
    marginBottom: 14,
  },
  label: {
    fontSize: 9,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  value: {
    fontSize: 12,
  },
  mapsLink: {
    fontSize: 11,
    color: "#1a73e8",
  },
  stopRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  stopNumber: {
    width: 22,
    fontSize: 11,
    color: "#888",
  },
  stopAddress: {
    flex: 1,
    fontSize: 11,
  },
  /** Fits A4 page minus horizontal padding (~515pt); matches 640×360 static map aspect */
  routeMapImage: {
    width: 515,
    height: 289,
    objectFit: "contain",
    marginTop: 4,
  },
});

type RoutePDFProps = {
  session: {
    watering_event_name: string;
    date: string;
    central_hub: string;
  };
  groupLeader: {
    name: string;
    email: string;
  } | null;
  route: {
    route_label: string;
    volunteer_type: string;
    maps_link: string | null;
  };
  stops: {
    order_to_visit: number;
    property_address: string;
  }[];
  /** Data URI (e.g. data:image/png;base64,...) from Maps Static API */
  routeMapImageSrc?: string | null;
};

export function RoutePDF({
  session,
  route,
  groupLeader,
  stops,
  routeMapImageSrc,
}: RoutePDFProps) {
  const sortedStops = [...stops].sort(
    (a, b) => a.order_to_visit - b.order_to_visit,
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{session.watering_event_name}</Text>
        <Text style={styles.eventDate}>{session.date}</Text>
        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>Central Hub</Text>
          <Text style={styles.value}>{session.central_hub}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Route</Text>
          <Text style={styles.value}>
            {route.route_label} — {route.volunteer_type}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Group Leader</Text>
          <Text style={styles.value}>
            {groupLeader
              ? `${groupLeader.name} (${groupLeader.email})`
              : "Not assigned"}
          </Text>
        </View>

        {route.maps_link && (
          <View style={styles.section}>
            <Text style={styles.label}>Google Maps Directions</Text>
            <Link src={route.maps_link} style={styles.mapsLink}>
              Open Route in Google Maps
            </Link>
          </View>
        )}

        {routeMapImageSrc ? (
          <View style={styles.section}>
            <Text style={styles.label}>Route Map</Text>
            <PdfImage src={routeMapImageSrc} style={styles.routeMapImage} />
          </View>
        ) : null}

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>Route Stops</Text>
          {sortedStops.map(stop => (
            <View key={stop.order_to_visit} style={styles.stopRow}>
              <Text style={styles.stopNumber}>{stop.order_to_visit}.</Text>
              <Text style={styles.stopAddress}>{stop.property_address}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
