package domain

import (
	"context"
	"equipment-integration/src/shared/pb"
	"time"

	"github.com/golang/glog"
)

const (
	Timeout = 30 * time.Second
)

type Olt struct {
	pb.UnimplementedOltServiceServer
}

type SeeSignal struct {
	Pon       string
	Positions []string
	Serials   []string
}

func (o *Olt) OltSeeSignal(ctx context.Context, input *pb.OltSeeSignalRequest) (*pb.OltSeeSignalResponse, error) {
	var response string

	request := SeeSignal{
		Pon:       input.GetPon(),
		Positions: input.GetPositions(),
		Serials:   input.GetSerials(),
	}

	if input.OltDefault.Manufacturer == "DATACOM" {
		response = seeSignalDatacom(input.OltDefault, &request)
	} else if input.OltDefault.Manufacturer == "FIBERHOME" {
		response = SeeSignalFiberHome(input.OltDefault, &request)
	} else {
		glog.Errorln("olt não possui essa funcionalidade")
	}

	return &pb.OltSeeSignalResponse{
		Data: response,
	}, nil
}
