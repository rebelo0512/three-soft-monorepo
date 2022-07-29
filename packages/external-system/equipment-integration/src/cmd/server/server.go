package main

import (
	"equipment-integration/src/domain"
	"equipment-integration/src/shared/pb"
	"flag"
	"fmt"
	"log"
	"net"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

func main() {
	flag.Parse()

	lis, err := net.Listen("tcp", ":9000")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := createGrpcServer()

	fmt.Println("Server running in port 9000")
	err = grpcServer.Serve(lis)
	if err != nil {
		log.Fatalf("failed to serve: %s", err)
	}
}

func createGrpcServer() *grpc.Server {
	grpcServer := grpc.NewServer()

	reflection.Register(grpcServer)

	registerServices(grpcServer)

	return grpcServer
}

func registerServices(grpcServer *grpc.Server) {
	pb.RegisterOltServiceServer(grpcServer, &domain.Olt{})
}
