
export class Role {
  private _id: string;
  private _name: string;

 private constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
  }

  static factory(
    id: string,
    name: string
  ): Role {
    return new Role(
      id,
      name
    )
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  private set name(value: string) {
    this._name = value;
  }
}