class ApiResponse{
  constructor(statusCOde,data,message="Successs"){
    this.statusCode=status.Code
    this.data=data
    this.message=message
    this.success=statusCode<400
  }
}