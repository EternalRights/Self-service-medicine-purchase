package com.eternalrights.service;

import com.eternalrights.entity.Drug;
import com.eternalrights.query.DrugQuery;
import com.eternalrights.result.PageResult;

public interface DrugsService {
    PageResult<Drug> getDrugsList(DrugQuery drugQuery);

    Drug getDrugById(Integer id);
}
