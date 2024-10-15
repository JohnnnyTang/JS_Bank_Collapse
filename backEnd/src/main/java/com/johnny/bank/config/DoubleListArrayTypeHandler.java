package com.johnny.bank.config;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.sql.*;
import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/5/7
 * @Description:
 */
public class DoubleListArrayTypeHandler extends BaseTypeHandler<List<Double>> {

    @Override
    public void setNonNullParameter(PreparedStatement preparedStatement, int i, List<Double> strings, JdbcType jdbcType) throws SQLException {
        if (strings != null) {
            Array array = preparedStatement.getConnection().createArrayOf(JdbcType.VARCHAR.name(), strings.toArray(new Double[0]));
            preparedStatement.setArray(i, array);
        }
    }

    @Override
    public List<Double> getNullableResult(ResultSet resultSet, String s) throws SQLException {
        Array array = resultSet.getArray(s);
        if (array == null) {
            return null;
        }
        Double[] result = (Double[]) array.getArray();
        array.free();
        return List.of(result);
    }

    @Override
    public List<Double> getNullableResult(ResultSet resultSet, int i) throws SQLException {
        Array array = resultSet.getArray(i);
        if (array == null) {
            return null;
        }
        Double[] result = (Double[]) array.getArray();
        array.free();
        return List.of(result);
    }

    @Override
    public List<Double> getNullableResult(CallableStatement callableStatement, int i) throws SQLException {
        Array array = callableStatement.getArray(i);
        if (array == null) {
            return null;
        }
        Double[] result = (Double[]) array.getArray();
        array.free();
        return List.of(result);
    }
}
