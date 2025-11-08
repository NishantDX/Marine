import { IGetAllRoutesUseCase } from "../../../ports/inbound/IRouteUseCases";
import { IRouteRepository } from "../../../ports/outbound/IRouteRepository";
import { Route } from "../../../domain/entities/Route";
import { FilterParams } from "../../../../shared/types/common.types";

export class GetAllRoutesUseCase implements IGetAllRoutesUseCase {
  constructor(private routeRepository: IRouteRepository) {}

  async execute(filters?: FilterParams): Promise<Route[]> {
    return await this.routeRepository.findAll(filters);
  }
}
