import SurveyUserRepository from '@modules/SurveyUser/repositories'

import { Request, Response } from 'express'

import { getCustomRepository, Not, IsNull } from 'typeorm'

export default class NpsController {
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params

    const surveysUsersRepository = getCustomRepository(SurveyUserRepository)

    const surveysUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    })

    const detractor = surveysUsers.filter(
      survey => Number(survey.value) >= 0 && Number(survey.value) <= 6,
    ).length

    const passives = surveysUsers.filter(
      survey => Number(survey.value) >= 7 && Number(survey.value) <= 8,
    ).length

    const promoters = surveysUsers.filter(
      survey => Number(survey.value) >= 9 && Number(survey.value) <= 10,
    ).length

    const totalAnswers = surveysUsers.length

    const calculate = Number(
      (((promoters - detractor) / totalAnswers) * 100).toFixed(2),
    )

    return response.json({
      detractor,
      passives,
      promoters,
      totalAnswers,
      nps: calculate,
    })
  }
}
