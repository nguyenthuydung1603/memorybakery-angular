
export class  UserType {
  constructor(
  public TypeName: string="",
  public Role: string=""
  ){}
}

export class Address {
  constructor(
  public AddressID: string="",
  public City: string="",
  public Town: string="",
  public Ward: string="",
  public DetailAddress: string="",
  public AddressType: string="",
  ){}
}

export class User {
  constructor(
  public FullName: string="",
  public Gender: string="",
  public DateOfBirth: string="",
  public Email: string="",
  public Phone: string="",
  public Image: string="",
  public Address: Address[],
  public UserName: string="",
  public Password: string="",
  public CreateDate: string="",
  public UserType: UserType
){}
}

