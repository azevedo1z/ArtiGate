import { ValidationException } from '../../shared/exceptions/app.exception';

export interface RoleProps {
  id: string;
  name: string;
}

export class Role {
  private _id: string;
  private _name: string;

  private constructor(props: RoleProps) {
    Role.ensureInvariants(props);

    this._id = props.id;
    this._name = props.name;
  }

  static factory(props: RoleProps): Role {
    return new Role(props);
  }

  static ensureInvariants(props: RoleProps): void {
    if (!props.name?.trim())
      throw new ValidationException('Role name is required.');
  }

  static normalizeName(raw: string): string {
    return (raw ?? '').trim().toUpperCase();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }
}
