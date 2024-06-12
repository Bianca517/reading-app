import React, { useEffect, useState } from 'react';
import { UserPositions, bookDTO } from '../../types';

export default {
    CURRENT_READINGS: [] as bookDTO[],
    FINALIZED_READINGS: [] as bookDTO[],
    MONTH_PLANNED_BOOKS: [] as bookDTO[],
    USER_CURRENT_POSITIONS: {} as UserPositions, 
}
