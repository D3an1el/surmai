package trips

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"io"
	"log"
)

func Export(e core.App, trip *core.Record) *ExportedTrip {

	t := Trip{
		Id:           trip.Id,
		Name:         trip.GetString("name"),
		Description:  trip.GetString("description"),
		StartDate:    trip.GetDateTime("startDate"),
		EndDate:      trip.GetDateTime("endDate"),
		CoverImage:   getUploadedFile(e, trip, trip.GetString("coverImage")),
		Destinations: getDestinations(trip),
		Participants: getParticipants(trip),
	}

	e.Logger().Debug("Exported Basic trip data", "id", trip.Id)

	transportations := buildTransportations(e, trip)
	lodgings := buildLodgings(e, trip)
	activities := buildActivities(e, trip)

	exportedTrip := ExportedTrip{
		Trip:            &t,
		Transportations: transportations,
		Lodgings:        lodgings,
		Activities:      activities,
	}

	return &exportedTrip
}

func buildActivities(e core.App, trip *core.Record) []*Activity {

	activities, _ := e.FindAllRecords("activities",
		dbx.NewExp("trip = {:tripId}", dbx.Params{"tripId": trip.Id}))

	var payload []*Activity
	for _, l := range activities {

		ct := Activity{
			Id:               l.Id,
			Name:             l.GetString("name"),
			Description:      l.GetString("description"),
			Address:          l.GetString("address"),
			StartDate:        l.GetDateTime("startDate"),
			ConfirmationCode: l.GetString("confirmationCode"),
			Attachments:      getAttachments(e, l),
		}
		_ = l.UnmarshalJSONField("metadata", &ct.Metadata)
		_ = l.UnmarshalJSONField("cost", &ct.Cost)
		payload = append(payload, &ct)
		e.Logger().Debug("Exported Activity  data", "id", l.Id)

	}

	return payload

}

func buildLodgings(e core.App, trip *core.Record) []*Lodging {

	lodgings, _ := e.FindAllRecords("lodgings",
		dbx.NewExp("trip = {:tripId}", dbx.Params{"tripId": trip.Id}))

	var payload []*Lodging
	for _, l := range lodgings {

		ct := Lodging{
			Id:               l.Id,
			Name:             l.GetString("name"),
			Address:          l.GetString("address"),
			StartDate:        l.GetDateTime("startDate"),
			EndDate:          l.GetDateTime("endDate"),
			ConfirmationCode: l.GetString("confirmationCode"),
			Type:             l.GetString("type"),
			Attachments:      getAttachments(e, l),
		}

		_ = l.UnmarshalJSONField("metadata", &ct.Metadata)
		_ = l.UnmarshalJSONField("cost", &ct.Cost)

		payload = append(payload, &ct)
		e.Logger().Debug("Exported Lodging  data", "id", l.Id)

	}

	return payload

}

func buildTransportations(e core.App, trip *core.Record) []*Transportation {

	transportations, _ := e.FindAllRecords("transportations",
		dbx.NewExp("trip = {:tripId}", dbx.Params{"tripId": trip.Id}))

	var payload []*Transportation
	for _, tr := range transportations {

		ct := Transportation{
			Id:          tr.Id,
			Type:        tr.GetString("type"),
			Origin:      tr.GetString("origin"),
			Destination: tr.GetString("destination"),
			Departure:   tr.GetDateTime("departureTime"),
			Arrival:     tr.GetDateTime("arrivalTime"),
			Attachments: getAttachments(e, tr),
		}

		_ = tr.UnmarshalJSONField("metadata", &ct.Metadata)
		_ = tr.UnmarshalJSONField("cost", &ct.Cost)

		payload = append(payload, &ct)
		e.Logger().Debug("Exported Transportation  data", "id", tr.Id)

	}

	return payload
}

func getAttachments(e core.App, r *core.Record) []*UploadedFile {

	attachments := r.GetStringSlice("attachments")
	var payload []*UploadedFile
	for _, attachmentName := range attachments {
		payload = append(payload, getUploadedFile(e, r, attachmentName))
	}
	return payload
}

func getUploadedFile(e core.App, record *core.Record, fileName string) *UploadedFile {

	if fileName != "" {
		return &UploadedFile{
			FileName:    fileName,
			FileContent: getFileAsBase64(e, record, fileName),
		}
	}
	return nil
}

func getFileAsBase64(e core.App, record *core.Record, fileName string) string {

	if fileName != "" {

		fileKey := record.BaseFilesPath() + "/" + fileName
		fsys, _ := e.NewFilesystem()
		defer fsys.Close()

		r, _ := fsys.GetFile(fileKey)
		defer r.Close()

		content := new(bytes.Buffer)
		_, _ = io.Copy(content, r)

		base64Str := base64.StdEncoding.EncodeToString(content.Bytes())
		return base64Str
	}

	return ""
}

func getDestinations(trip *core.Record) []Destination {
	destinationsString := trip.GetString("destinations")
	var payload []Destination

	err := json.Unmarshal([]byte(destinationsString), &payload)
	if err != nil {
		log.Fatal("Error during Destinations Unmarshal(): ", err)
	}

	return payload
}

func getParticipants(trip *core.Record) []Participant {
	participantString := trip.GetString("participants")
	var payload []Participant

	err := json.Unmarshal([]byte(participantString), &payload)
	if err != nil {
		log.Fatal("Error during Participants Unmarshal(): ", err)
	}

	return payload
}