import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface UserProps {
  subscriberId: string
  name: string
  email: string
  status: string
}

export class User extends Entity<UserProps> {
  get subscriberId() {
    return this.props.subscriberId
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get email() {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
  }

  get status() {
    return this.props.status
  }

  set status(status: string) {
    this.props.status = status
  }

  static create(props: UserProps, id?: UniqueEntityID) {
    const user = new User(props, id)
    return user
  }

  update(props: Partial<UserProps>): void {
    Object.assign(this.props, props)
  }
}
