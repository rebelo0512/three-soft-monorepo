package main

import (
	"context"
	"equipment-integration/src/shared/pb"
	"fmt"

	"github.com/golang/glog"
	"google.golang.org/grpc"
)

func main() {
	conn, err := grpc.Dial("localhost:9000", grpc.WithInsecure())
	if err != nil {
		glog.Exitln(err)
	}
	oltClient := pb.NewOltServiceClient(conn)
	defer conn.Close()

	request := &pb.OltSeeSignalRequest{
		OltDefault: &pb.OltDefaultRequest{
			Manufacturer: "DATACOM",
			Hostname:     "10.30.11.2",
			Port:         "22",
			Username:     "admin",
			Password:     "n3or3d3n0cnew",
			Unm:          "",
			Slot:         "",
		},
		Pon:       "1",
		Positions: []string{"1", "2"},
		Serials:   []string{},
	}

	response, err := oltClient.OltSeeSignal(context.Background(), request)
	if err != nil {
		glog.Errorln(err)
	}

	fmt.Println(response.Data)
}

// &pb.OltSeeSignalRequest{
//   OltDefault: &pb.OltDefaultRequest{
//     Manufacturer: "DATACOM",
//     Hostname:     "10.30.11.2",
//     Port:         "22",
//     Username:     "admin",
//     Password:     "n3or3d3n0cnew",
//     Unm:          "",
//     Slot:         "",
//   },
//   Pon:       "1",
//   Positions: []string{"1", "2"},
//   Serials:   []string{},
// }

// &pb.OltSeeSignalRequest{
//   OltDefault: &pb.OltDefaultRequest{
//     Manufacturer: "FIBERHOME",
//     Hostname:     "10.30.237.2",
//     Port:         "22",
//     Username:     "jean.santos",
//     Password:     "Noc@1010",
//     Unm:          "172.31.78.175",
//     Slot:         "1",
//   },
//   Pon:       "1",
//   Positions: []string{},
//   Serials:   []string{"FHTT9A423598", "FHTT9A407E40"},
// }
