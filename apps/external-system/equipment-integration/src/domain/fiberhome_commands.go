package domain

import (
	"equipment-integration/src/shared/pb"
	"net"
	"os"
)

func SeeSignalFiberHome(oltDefault *pb.OltDefaultRequest, seeSignal *SeeSignal) string {
	tcpAddr, err := net.ResolveTCPAddr("tcp", oltDefault.Unm+":3337")
	if err != nil {
		println("ResolveTCPAddr failed:", err.Error())
		os.Exit(1)
	}

	conn, err := net.DialTCP("tcp", nil, tcpAddr)
	if err != nil {
		println("Dial failed:", err.Error())
		os.Exit(1)
	}
	defer conn.Close()

	command := "LOGIN:::CTAG::UN=" + oltDefault.Username + ",PWD=" + oltDefault.Password + ";"

	_, err = conn.Write([]byte(command))
	if err != nil {
		println(err.Error())
		os.Exit(1)
	}

	reply := make([]byte, 1024)

	_, err = conn.Read(reply)
	if err != nil {
		println(err.Error())
		os.Exit(1)
	}

	response := ""

	for _, serial := range seeSignal.Serials {
		command2 := "LST-OMDDM::OLTID=" + oltDefault.Hostname + ",PONID=NA-NA-" + oltDefault.Slot + "-" + seeSignal.Pon + ",ONUIDTYPE=MAC,ONUID=" + serial + ":CTAG::;"
		_, err = conn.Write([]byte(command2))
		if err != nil {
			println(err.Error())
			os.Exit(1)
		}

		reply2 := make([]byte, 1024)

		_, err = conn.Read(reply2)
		if err != nil {
			println(err.Error())
			os.Exit(1)
		}

		response += string(reply2) + "\n"
	}

	return response

}
