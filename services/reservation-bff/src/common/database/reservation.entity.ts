import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RentalUnitEntity } from './rental-unit.entity';

@Entity('reservations')
export class ReservationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  rentalUnitId!: string;

  @ManyToOne(() => RentalUnitEntity, (u) => u.reservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rentalUnitId' })
  rentalUnit!: RentalUnitEntity;

  @Column({ type: 'text' })
  guestName!: string;

  @Column({ type: 'text' })
  startDate!: string;

  @Column({ type: 'text' })
  endDate!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
