package domain

import (
	"equipment-integration/src/shared/pb"
	"regexp"

	"github.com/golang/glog"
	expect "github.com/google/goexpect"
	"golang.org/x/crypto/ssh"
)

func seeSignalDatacom(oltDefault *pb.OltDefaultRequest, seeSignal *SeeSignal) string {
	Prompt := regexp.MustCompile("DM[0-9]{0,}#")

	sshClt, err := ssh.Dial("tcp", oltDefault.Hostname+":"+oltDefault.Port, &ssh.ClientConfig{
		User:            oltDefault.Username,
		Auth:            []ssh.AuthMethod{ssh.Password(oltDefault.Password)},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
	})
	if err != nil {
		glog.Errorln("ssh.Dial(%q) failed: %v", oltDefault.Hostname, err)
	}
	defer sshClt.Close()

	e, _, err := expect.SpawnSSH(sshClt, Timeout)
	if err != nil {
		glog.Exit(err)
	}
	defer e.Close()

	e.Expect(Prompt, Timeout)

	response := ""

	for _, position := range seeSignal.Positions {
		e.Send("show interface gpon 1/1/" + seeSignal.Pon + " onu " + position + " optical-info" + "\n")
		stdout, _, _ := e.Expect(Prompt, Timeout)
		response += stdout + "\n"
	}

	return response
}
